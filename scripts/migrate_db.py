import pandas as pd
import json
import math

# 이 스크립트는 엑셀 파일에서 데이터를 읽어 JSON 형태로 가공한 뒤 출력합니다.

file_path = 'database.xlsx.xlsx'

def clean_val(v):
    if pd.isna(v) or v is None or str(v).strip() == '' or str(v) == 'nan':
        return None
    return str(v).strip()

try:
    xl = pd.ExcelFile(file_path)
    
    # 1. Config 탭 읽기
    if 'Config' in xl.sheet_names:
        df_config = xl.parse('Config')
        config_data = []
        for index, row in df_config.iterrows():
            key = clean_val(row.get('Key'))
            if key and key != 'nan':
                config_data.append({
                    'key': key,
                    'value': clean_val(row.get('Value')),
                    'description': clean_val(row.get('Description'))
                })
        
        with open('migrate_config.json', 'w', encoding='utf-8') as f:
            json.dump(config_data, f, ensure_ascii=False, indent=2)
        print(f"Config 탭 마이그레이션 준비 완료: {len(config_data)}건")

    # 2. Edu_DB 탭 읽기
    if 'Edu_DB' in xl.sheet_names:
        df_edu = xl.parse('Edu_DB')
        edu_data = []
        for index, row in df_edu.iterrows():
            emp_name = clean_val(row.get('이 름'))
            if emp_name:
                edu_data.append({
                    'emp_id': clean_val(row.get('사번')),
                    'location': clean_val(row.get('근무지')),
                    'department': clean_val(row.get('부 서')),
                    'emp_name': emp_name,
                    'is_completed': clean_val(row.get('Unnamed: 4')) == 'O'
                })
                
        with open('migrate_edu.json', 'w', encoding='utf-8') as f:
            json.dump(edu_data, f, ensure_ascii=False, indent=2)
        print(f"Edu_DB 탭 마이그레이션 준비 완료: {len(edu_data)}건")

    # 3. TBM 탭 읽기
    if 'TBM' in xl.sheet_names:
        df_tbm = xl.parse('TBM')
        tbm_data = []
        for index, row in df_tbm.iterrows():
            date_val = clean_val(row.get('일시'))
            if date_val:
                tbm_data.append({
                    'date': date_val,
                    'type': clean_val(row.get('구분')),
                    'conductor': clean_val(row.get('실시자')),
                    'content': clean_val(row.get('내용')),
                    'issues': clean_val(row.get('특이사항')),
                    'participants': [p.strip() for p in str(clean_val(row.get('명단'))).split(',')] if clean_val(row.get('명단')) else [],
                    'safety_notice': clean_val(row.get('안전공지')),
                    'production_notice': clean_val(row.get('생산공지'))
                })
        
        with open('migrate_tbm.json', 'w', encoding='utf-8') as f:
            json.dump(tbm_data, f, ensure_ascii=False, indent=2)
        print(f"TBM 탭 마이그레이션 준비 완료: {len(tbm_data)}건")

    # 4. Legal_DB 탭 읽기
    if 'Legal_DB' in xl.sheet_names:
        df_legal = xl.parse('Legal_DB')
        df_legal['구 분'] = df_legal['구 분'].ffill() # Forward fill location
        legal_data = []
        for index, row in df_legal.iterrows():
            title = clean_val(row.get('대 상'))
            officer_name = clean_val(row.get('Unnamed: 5'))
            if title and officer_name and officer_name != '성 명':
                allowance_val = clean_val(row.get('수 당'))
                has_allowance = False
                if allowance_val and str(allowance_val).isdigit() and int(allowance_val) > 0:
                    has_allowance = True
                
                legal_data.append({
                    'location': clean_val(row.get('구 분')),
                    'title': title,
                    'officer_name': officer_name,
                    'appointed_date': clean_val(row.get('선임일')),
                    'prev_edu_date': clean_val(row.get('이전 교육일')),
                    'next_edu_date': clean_val(row.get('다음 교육일')),
                    'allowance': has_allowance,
                    'note': clean_val(row.get('비 고'))
                })
        
        with open('migrate_legal.json', 'w', encoding='utf-8') as f:
            json.dump(legal_data, f, ensure_ascii=False, indent=2)
        print(f"Legal_DB 탭 마이그레이션 준비 완료: {len(legal_data)}건")

    # 5. Kosha 탭 읽기
    if 'Kosha' in xl.sheet_names:
        # Kosha 탭은 헤더가 없을 수 있으므로 header=None으로 읽음
        df_kosha = xl.parse('Kosha', header=None)
        kosha_data = []
        for index, row in df_kosha.iterrows():
            kosha_id = clean_val(row.get(0))
            if kosha_id and str(kosha_id).lower() != '게시물 번호' and str(kosha_id).lower() != 'nan':
                analysis_str = clean_val(row.get(3))
                location, accident_type, time_info, casualty = "", "", "", ""
                if analysis_str:
                    parts = [p.strip() for p in analysis_str.split('|')]
                    location = parts[0] if len(parts) > 0 else ""
                    accident_type = parts[1] if len(parts) > 1 else ""
                    time_info = parts[2] if len(parts) > 2 else ""
                    casualty = parts[3] if len(parts) > 3 else ""
                
                # 날짜 파싱 시도
                pub_date = None
                if time_info:
                    import re
                    match = re.search(r'(\d{4})[\.\-]\s*(\d{1,2})[\.\-]\s*(\d{1,2})', time_info)
                    if match:
                        pub_date = f"{match.group(1)}-{match.group(2).zfill(2)}-{match.group(3).zfill(2)} 00:00:00+09:00"

                kosha_data.append({
                    'kosha_id': str(kosha_id),
                    'title': clean_val(row.get(1)) or "제목 없음",
                    'content': clean_val(row.get(2)),
                    'location': location,
                    'casualty': casualty,
                    'url': clean_val(row.get(4)),
                    'published_at': pub_date
                })
        
        with open('migrate_kosha.json', 'w', encoding='utf-8') as f:
            json.dump(kosha_data, f, ensure_ascii=False, indent=2)
        print(f"Kosha 탭 마이그레이션 준비 완료: {len(kosha_data)}건")

    print("\n마이그레이션 데이터 파일(JSON)이 생성되었습니다.")

except Exception as e:
    print(f"Error: {e}")
