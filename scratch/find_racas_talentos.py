import pypdf
import re

reader = pypdf.PdfReader('fontes_tormenta/Tormenta RPG - Manual das Raças.pdf')

print("Extraindo seções de talentos do Manual das Raças...")
for p in range(80, 103):
    text = reader.pages[p].extract_text() or ''
    # Procura títulos de talentos em linhas destacadas
    lines = text.split('\n')
    for l in lines:
        if any(cat in l for cat in ['[Combate]', '[Perícia]', '[Destino]', '[Magia]', '[Racial]', '[Ambiental]', '[Tormenta]', '(Combate)', '(Perícia)', '(Destino)', '(Magia)', '(Racial)', '(Ambiental)', '(Tormenta)']):
            print(f"Pág {p+1}: {l.strip()}")

