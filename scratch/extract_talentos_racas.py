import re
import json
import unicodedata

with open('scratch/racas_talentos_raw.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

# Dividir por ocorrências de Benefício: ou Benefícios:
parts = re.split(r'\n(?=(?:Benefício|Benefícios):)', raw)

print(f"Número de blocos encontrados por 'Benefício:': {len(parts)}")

talentos_racas = []
for i in range(len(parts) - 1):
    header_block = parts[i]
    body_block = parts[i+1]
    
    # O cabeçalho do talento i+1 está no final de header_block!
    # No body_block, o benefício vai até o início do próximo talento
    # Vamos inspecionar as últimas linhas do header_block
    header_lines = [l.strip() for l in header_block.split('\n') if l.strip() and not l.strip().isdigit() and not l.strip().startswith('--- PÁGINA')]
    
    # Procura Pré-requisito nas últimas linhas
    prereq = 'Nenhum.'
    prereq_idx = -1
    for idx, l in enumerate(header_lines):
        if l.startswith('Pré-requisito') or l.startswith('Pré-Requisito'):
            prereq = ' '.join(header_lines[idx:])
            prereq_idx = idx
            break
            
    if prereq_idx != -1:
        before_prereq = header_lines[:prereq_idx]
    else:
        before_prereq = header_lines
        
    if len(before_prereq) >= 2:
        nome = before_prereq[-2]
        desc = before_prereq[-1]
    elif len(before_prereq) == 1:
        nome = before_prereq[-1]
        desc = ''
    else:
        continue
        
    # Limpa prereq
    prereq = re.sub(r'^Pré-[rR]equisitos?:\s*', '', prereq)
    
    # O benefício é o início de body_block até encontrar linhas que pareçam o próximo talento
    # No split, body_block começa com Benefício:
    body_lines = [l.strip() for l in body_block.split('\n') if l.strip() and not l.strip().isdigit() and not l.strip().startswith('--- PÁGINA')]
    
    # Pega até 10 linhas ou até a próxima seção
    benef_lines = []
    for l in body_lines:
        if l.startswith('Pré-requisito') or l.startswith('Pré-Requisito'):
            # Já chegamos no próximo
            break
        benef_lines.append(l)
        
    benef_text = ' '.join(benef_lines[:6]) # primeira parte
    talentos_racas.append({
        'nome': nome,
        'prereq': prereq,
        'desc': desc,
        'benef_sample': benef_text[:100]
    })

print(f"Total talentos extraídos preliminares: {len(talentos_racas)}")
for t in talentos_racas[:25]:
    print(f"- {t['nome']} | Pré: {t['prereq'][:40]} | Benefício: {t['benef_sample'][:40]}")

