import {
  calcularCaTotal,
  calcularModificador,
  calcularResistencia,
  FichaPersonagem,
  formatarModificador,
  obterModAtributo,
} from '../models/ficha';

export function gerarHtmlFichaPdf(ficha: FichaPersonagem): string {
  const caTotal = calcularCaTotal(ficha);
  const modFor = formatarModificador(obterModAtributo(ficha, 'FOR'));
  const modDes = formatarModificador(obterModAtributo(ficha, 'DES'));
  const modCon = formatarModificador(obterModAtributo(ficha, 'CON'));
  const modInt = formatarModificador(obterModAtributo(ficha, 'INT'));
  const modSab = formatarModificador(obterModAtributo(ficha, 'SAB'));
  const modCar = formatarModificador(obterModAtributo(ficha, 'CAR'));

  const fortTotal = calcularResistencia(ficha, 'fortitude');
  const reflTotal = calcularResistencia(ficha, 'reflexos');
  const vontTotal = calcularResistencia(ficha, 'vontade');

  const meioNivel = Math.floor((ficha.nivel || 1) / 2);

  // Renderizar armas
  const armasHtml =
    ficha.armas && ficha.armas.length > 0
      ? ficha.armas
          .map(
            (a) => `
        <tr>
          <td><strong>${a.nome || '-'}</strong></td>
          <td style="text-align:center;">${a.bonusAtaque || '+0'}</td>
          <td style="text-align:center;">${a.dano || '-'}</td>
          <td style="text-align:center;">${a.critico || '-'}</td>
          <td style="text-align:center;">${a.distancia || '-'}</td>
          <td style="text-align:center;">${a.tipoDano || '-'}</td>
        </tr>
      `
          )
          .join('')
      : `<tr><td colspan="6" style="text-align:center; color:#777;">Nenhuma arma cadastrada</td></tr>`;

  // Renderizar perícias em 2 colunas
  const pericias = ficha.pericias || [];
  const metade = Math.ceil(pericias.length / 2);
  const col1Pericias = pericias.slice(0, metade);
  const col2Pericias = pericias.slice(metade);

  const renderTabelaPericias = (lista: typeof pericias) => `
    <table class="tabela-pericias">
      <thead>
        <tr>
          <th style="width:20px;">T</th>
          <th>Perícia</th>
          <th style="width:35px;">Atrib</th>
          <th style="width:40px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${lista
          .map((p) => {
            const modAtr = obterModAtributo(ficha, p.atributoChave);
            const treinoBonus = p.treinada ? 4 : 0;
            const outros = Number(p.outrosBonus) || 0;
            const total = meioNivel + modAtr + treinoBonus + outros;
            return `
            <tr>
              <td style="text-align:center;">${p.treinada ? '☑' : '☐'}</td>
              <td>${p.nome}${p.complemento ? ` (${p.complemento})` : ''}</td>
              <td style="text-align:center; font-size:10px; color:#555;">${p.atributoChave}</td>
              <td style="text-align:center; font-weight:bold;">${total >= 0 ? `+${total}` : total}</td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>
  `;

  // Talentos e Habilidades
  const talentosHtml =
    ficha.talentos && ficha.talentos.length > 0
      ? ficha.talentos
          .map(
            (t) => `
        <div class="bloco-item">
          <div class="item-titulo">${t.nome}</div>
          <div class="item-desc">${t.descricao.replace(/\n/g, '<br/>')}</div>
        </div>
      `
          )
          .join('')
      : '<p style="color:#777; font-size:11px;">Nenhum talento cadastrado.</p>';

  const racaClasseHabsHtml = [
    ...(ficha.habilidadesRaca || []).map((h) => ({ ...h, tipo: 'Racial' })),
    ...(ficha.habilidadesClasse || []).map((h) => ({ ...h, tipo: 'Classe' })),
  ]
    .map(
      (h) => `
      <div class="bloco-item">
        <div class="item-titulo">[${h.tipo}] ${h.nome}</div>
        <div class="item-desc">${h.descricao.replace(/\n/g, '<br/>')}</div>
      </div>
    `
    )
    .join('');

  // Magias agrupadas por nível
  const magiasHtml =
    ficha.magias && ficha.magias.length > 0
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
          .map((lvl) => {
            const magiasNivel = ficha.magias.filter((m) => m.nivelCirculo === lvl);
            if (magiasNivel.length === 0) return '';
            return `
            <div class="nivel-magia-header">${lvl === 0 ? 'Nível 0 (Truques)' : `${lvl}º Círculo / Nível`}</div>
            ${magiasNivel
              .map(
                (m) => `
              <div class="bloco-item">
                <div class="item-titulo">${m.nome} <span style="font-weight:normal; font-size:11px; color:#777;">(Custo: ${m.custoPm || lvl} PM)</span></div>
                <div class="item-desc">${m.descricao.replace(/\n/g, '<br/>')}</div>
              </div>
            `
              )
              .join('')}
          `;
          })
          .join('')
      : '<p style="color:#777; font-size:11px;">Nenhuma magia cadastrada.</p>';

  // Equipamentos e Itens
  const armadurasHtml =
    ficha.armaduras && ficha.armaduras.length > 0
      ? ficha.armaduras
          .map(
            (arm) => `
        <tr>
          <td><strong>${arm.nome}</strong></td>
          <td style="text-align:center;">${arm.tipo === 'ARMADURA' ? 'Armadura' : 'Escudo'}</td>
          <td style="text-align:center; font-weight:bold;">+${arm.bonusCa}</td>
          <td style="text-align:center;">${arm.equipada ? 'Sim' : 'Não'}</td>
        </tr>
      `
          )
          .join('')
      : '<tr><td colspan="4" style="text-align:center; color:#777;">Nenhuma armadura/escudo</td></tr>';

  const itensGeraisHtml =
    ficha.itensGerais && ficha.itensGerais.length > 0
      ? ficha.itensGerais
          .map(
            (it) => `
        <span class="tag-item">${it.nome}${it.quantidade ? ` (x${it.quantidade})` : ''}</span>
      `
          )
          .join(' ')
      : '<span style="color:#777; font-size:11px;">Mochila vazia.</span>';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Ficha de Personagem - ${ficha.nomePersonagem || 'Tormenta RPG'}</title>
      <style>
        @page {
          size: A4;
          margin: 10mm 12mm;
        }
        * {
          box-sizing: border-box;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        body {
          color: #1F1A17;
          background: #FFFFFF;
          margin: 0;
          padding: 0;
          font-size: 11px;
          line-height: 1.35;
        }
        .header-principal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #8B1E1E;
          padding-bottom: 6px;
          margin-bottom: 10px;
        }
        .logo-title {
          font-size: 24px;
          font-weight: 900;
          color: #8B1E1E;
          letter-spacing: 1.5px;
          margin: 0;
        }
        .logo-subtitle {
          font-size: 11px;
          color: #C89D3C;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0;
        }
        .dados-gerais-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          background: #F9F6F0;
          border: 1px solid #DEC9A8;
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 10px;
        }
        .dado-item {
          display: flex;
          flex-direction: column;
        }
        .dado-label {
          font-size: 9px;
          font-weight: bold;
          color: #8B1E1E;
          text-transform: uppercase;
        }
        .dado-valor {
          font-size: 12px;
          font-weight: bold;
          color: #1F1A17;
        }

        /* Atributos e Combate */
        .secao-topo-combate {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        .bloco-atributos {
          display: flex;
          gap: 6px;
          flex: 1.2;
        }
        .card-atributo {
          flex: 1;
          text-align: center;
          background: #F9F6F0;
          border: 1px solid #8B1E1E;
          border-radius: 6px;
          padding: 4px;
        }
        .atr-sigla {
          font-size: 11px;
          font-weight: 900;
          color: #8B1E1E;
        }
        .atr-valor {
          font-size: 16px;
          font-weight: bold;
          color: #1F1A17;
          margin: 2px 0;
        }
        .atr-mod {
          font-size: 11px;
          font-weight: bold;
          background: #8B1E1E;
          color: #FFFFFF;
          border-radius: 4px;
          padding: 1px 0;
        }

        .bloco-combate-status {
          display: flex;
          flex: 1;
          gap: 6px;
        }
        .card-status {
          flex: 1;
          background: #F9F6F0;
          border: 1px solid #DEC9A8;
          border-radius: 6px;
          padding: 4px 6px;
          text-align: center;
        }
        .status-label {
          font-size: 9px;
          font-weight: bold;
          color: #5E5147;
          text-transform: uppercase;
        }
        .status-val {
          font-size: 16px;
          font-weight: 900;
          color: #8B1E1E;
        }

        /* Seções e Tabelas */
        .secao-titulo {
          font-size: 12px;
          font-weight: 900;
          color: #8B1E1E;
          text-transform: uppercase;
          border-bottom: 1px solid #DEC9A8;
          padding-bottom: 2px;
          margin-top: 8px;
          margin-bottom: 6px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin-bottom: 8px;
        }
        th {
          background: #8B1E1E;
          color: #FFFFFF;
          font-weight: bold;
          padding: 4px 6px;
          text-align: left;
        }
        td {
          padding: 4px 6px;
          border-bottom: 1px solid #EEE;
        }
        tr:nth-child(even) td {
          background: #FAF8F5;
        }

        /* Perícias em 2 Colunas */
        .pericias-wrapper {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        .pericias-col {
          flex: 1;
        }

        /* Talentos e Magias */
        .bloco-item {
          background: #FDFBF7;
          border: 1px solid #EADBCC;
          border-left: 3px solid #8B1E1E;
          border-radius: 4px;
          padding: 5px 8px;
          margin-bottom: 5px;
          page-break-inside: avoid;
        }
        .item-titulo {
          font-weight: bold;
          color: #8B1E1E;
          font-size: 11px;
          margin-bottom: 2px;
        }
        .item-desc {
          font-size: 10px;
          color: #333;
          line-height: 1.3;
        }
        .nivel-magia-header {
          font-size: 11px;
          font-weight: bold;
          color: #C89D3C;
          background: #2A1010;
          padding: 3px 6px;
          border-radius: 4px;
          margin: 6px 0 4px 0;
        }
        .tag-item {
          display: inline-block;
          background: #F2E9D8;
          border: 1px solid #DEC9A8;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 10px;
          margin: 2px;
        }
        .footer-impressao {
          text-align: center;
          font-size: 9px;
          color: #888;
          margin-top: 15px;
          border-top: 1px dashed #CCC;
          padding-top: 4px;
        }
      </style>
    </head>
    <body>
      <!-- Cabeçalho Principal -->
      <div class="header-principal">
        <div>
          <h1 class="logo-title">TORMENTA RPG</h1>
          <p class="logo-subtitle">Ficha Oficial de Personagem</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:16px; font-weight:bold; color:#8B1E1E;">${ficha.nomePersonagem || 'Personagem'}</div>
          <div style="font-size:11px; color:#555;">Nível ${ficha.nivel} • ${ficha.raca || '-'} • ${ficha.classe || '-'}</div>
        </div>
      </div>

      <!-- Dados Gerais -->
      <div class="dados-gerais-grid">
        <div class="dado-item"><span class="dado-label">Jogador</span><span class="dado-valor">${ficha.jogador || '-'}</span></div>
        <div class="dado-item"><span class="dado-label">Tendência</span><span class="dado-valor">${ficha.tendencia || '-'}</span></div>
        <div class="dado-item"><span class="dado-label">Divindade</span><span class="dado-valor">${ficha.divindade || '-'}</span></div>
        <div class="dado-item"><span class="dado-label">Tamanho / Desl.</span><span class="dado-valor">${ficha.tamanho || 'Médio'} / ${ficha.deslocamento || '9m'}</span></div>
        <div class="dado-item"><span class="dado-label">Sexo / Idade</span><span class="dado-valor">${ficha.sexo || '-'} / ${ficha.idade || '-'}</span></div>
        <div class="dado-item"><span class="dado-label">Tibares (Riqueza)</span><span class="dado-valor">${ficha.tibares || '0 TO'}</span></div>
        <div class="dado-item"><span class="dado-label">Meio Nível</span><span class="dado-valor">+${meioNivel}</span></div>
        <div class="dado-item"><span class="dado-label">BBA (Base)</span><span class="dado-valor">+${ficha.bba || 0}</span></div>
      </div>

      <!-- Atributos e Combate -->
      <div class="secao-topo-combate">
        <div class="bloco-atributos">
          <div class="card-atributo"><div class="atr-sigla">FOR</div><div class="atr-valor">${ficha.forca}</div><div class="atr-mod">${modFor}</div></div>
          <div class="card-atributo"><div class="atr-sigla">DES</div><div class="atr-valor">${ficha.destreza}</div><div class="atr-mod">${modDes}</div></div>
          <div class="card-atributo"><div class="atr-sigla">CON</div><div class="atr-valor">${ficha.constituicao}</div><div class="atr-mod">${modCon}</div></div>
          <div class="card-atributo"><div class="atr-sigla">INT</div><div class="atr-valor">${ficha.inteligencia}</div><div class="atr-mod">${modInt}</div></div>
          <div class="card-atributo"><div class="atr-sigla">SAB</div><div class="atr-valor">${ficha.sabedoria}</div><div class="atr-mod">${modSab}</div></div>
          <div class="card-atributo"><div class="atr-sigla">CAR</div><div class="atr-valor">${ficha.carisma}</div><div class="atr-mod">${modCar}</div></div>
        </div>

        <div class="bloco-combate-status">
          <div class="card-status"><div class="status-label">PV (Vida)</div><div class="status-val">${ficha.pvAtual}/${ficha.pvTotal}</div></div>
          <div class="card-status"><div class="status-label">PM (Mana)</div><div class="status-val">${ficha.pmAtual}/${ficha.pmTotal}</div></div>
          <div class="card-status"><div class="status-label">CA Total</div><div class="status-val">${caTotal}</div></div>
          <div class="card-status"><div class="status-label">Fortitude</div><div class="status-val">+${fortTotal}</div></div>
          <div class="card-status"><div class="status-label">Reflexos</div><div class="status-val">+${reflTotal}</div></div>
          <div class="card-status"><div class="status-label">Vontade</div><div class="status-val">+${vontTotal}</div></div>
        </div>
      </div>

      <!-- Armas & Ataques -->
      <div class="secao-titulo">Ataques & Armas</div>
      <table>
        <thead>
          <tr>
            <th>Arma</th>
            <th style="width:70px; text-align:center;">Ataque</th>
            <th style="width:70px; text-align:center;">Dano</th>
            <th style="width:70px; text-align:center;">Crítico</th>
            <th style="width:70px; text-align:center;">Alcance</th>
            <th style="width:70px; text-align:center;">Tipo</th>
          </tr>
        </thead>
        <tbody>
          ${armasHtml}
        </tbody>
      </table>

      <!-- Armaduras & Proteções -->
      <div class="secao-titulo">Armaduras & Proteções</div>
      <table>
        <thead>
          <tr>
            <th>Nome do Equipamento</th>
            <th style="width:90px; text-align:center;">Tipo</th>
            <th style="width:80px; text-align:center;">Bônus CA</th>
            <th style="width:80px; text-align:center;">Equipada</th>
          </tr>
        </thead>
        <tbody>
          ${armadurasHtml}
        </tbody>
      </table>

      <!-- Perícias em Duas Colunas -->
      <div class="secao-titulo">Perícias</div>
      <div class="pericias-wrapper">
        <div class="pericias-col">${renderTabelaPericias(col1Pericias)}</div>
        <div class="pericias-col">${renderTabelaPericias(col2Pericias)}</div>
      </div>

      <!-- Habilidades e Talentos -->
      <div class="secao-titulo">Talentos & Habilidades de Raça / Classe</div>
      ${racaClasseHabsHtml}
      ${talentosHtml}

      <!-- Magias e Grimório -->
      <div class="secao-titulo">Grimório de Magias</div>
      ${magiasHtml}

      <!-- Equipamentos e Mochila -->
      <div class="secao-titulo">Itens Gerais & Equipamentos</div>
      <div style="padding:4px 0;">${itensGeraisHtml}</div>

      <div class="footer-impressao">
        Ficha gerada pelo aplicativo Tormenta RPG Ficha Android • Versão 1.1.0 • ${new Date().toLocaleDateString('pt-BR')}
      </div>
    </body>
    </html>
  `;
}
