// Base de dados verificada manualmente a partir de fontes oficiais
// (portais da Prefeitura do Recife, Compesa, Neoenergia Pernambuco e CTTU).
// Isto NÃO é gerado por IA — é a fonte de verdade usada sempre que a
// situação relatada se encaixa em uma destas categorias conhecidas.
// A IA só entra para classificar QUAL categoria se aplica, nunca para
// inventar o telefone/endereço destes órgãos.
//
// Última checagem manual: julho de 2026. Como esses dados podem mudar,
// sempre confira no canal oficial antes de um contato formal.

export const AGENCY_DATA_VERIFIED_AT = "julho de 2026";

export const VERIFIED_AGENCIES = {
  agua: {
    orgao: "Compesa — Companhia Pernambucana de Saneamento",
    descricaoResponsabilidade: "Responsável pelo abastecimento de água e coleta/tratamento de esgoto em Recife.",
    telefone: "0800 081 0195 (teleatendimento 24h)",
    email: "Ouvidoria pelo portal oficial (não há e-mail direto público)",
    site: "servicos.compesa.com.br",
    endereco: "Av. Cruz Cabugá, 1387 — Santo Amaro, Recife/PE, CEP 50040-000",
    horario: "Teleatendimento 24 horas",
  },
  energia: {
    orgao: "Neoenergia Pernambuco",
    descricaoResponsabilidade: "Distribuidora responsável pelo fornecimento de energia elétrica em todo o estado de Pernambuco.",
    telefone: "116 (teleatendimento 24h, gratuito)",
    email: "Atendimento pela Agência Virtual ou app Neoenergia Pernambuco",
    site: "neoenergia.com/web/pernambuco",
    endereco: "Av. Conde da Boa Vista, 720 — Boa Vista, Recife/PE, CEP 50060-004",
    horario: "Teleatendimento 24 horas",
  },
  emlurb: {
    orgao: "EMLURB — Autarquia de Manutenção e Limpeza Urbana do Recife",
    descricaoResponsabilidade: "Responsável por iluminação pública, poda/manejo de árvores, buracos e pavimentação, coleta de lixo e drenagem urbana.",
    telefone: "156 (Central de Atendimento da Prefeitura do Recife)",
    email: "emlurb@recife.pe.gov.br",
    site: "emlurb.recife.pe.gov.br",
    endereco: "Av. Governador Carlos de Lima Cavalcanti, 9 — Boa Vista, Recife/PE",
    horario: "Consulte horário atualizado da Central 156 / app Conecta Recife",
  },
  transito: {
    orgao: "CTTU — Autarquia de Trânsito e Transporte Urbano do Recife",
    descricaoResponsabilidade: "Responsável por semáforos, sinalização viária e fiscalização de trânsito no município.",
    telefone: "0800 081 1078 (denúncias e ocorrências, 24h)",
    email: "ouvidoria@recife.pe.gov.br (Ouvidoria Geral da Prefeitura)",
    site: "cttu.recife.pe.gov.br",
    endereco: "Av. Cruz Cabugá, 304 — Santo Amaro, Recife/PE, CEP 50040-000",
    horario: "Atendimento presencial: 8h às 13h (recepção até 17h)",
  },
  saude: {
    orgao: "Ouvidoria Municipal do SUS — Secretaria de Saúde do Recife",
    descricaoResponsabilidade: "Recebe denúncias, reclamações e solicitações sobre unidades e serviços de saúde pública municipal.",
    telefone: "0800 281 1520",
    email: "Formulário no portal da Prefeitura do Recife",
    site: "www2.recife.pe.gov.br/servico/ouvidoria-municipal-da-saude",
    endereco: "Rua do Veiga, 268 — Santo Amaro, Recife/PE, CEP 50040-110",
    horario: "Telefone: seg. a sex., 7h às 19h · Presencial: 9h-12h e 14h-16h",
  },
  geral: {
    orgao: "Ouvidoria Geral da Prefeitura do Recife",
    descricaoResponsabilidade: "Canal geral para reclamações, sugestões e denúncias sobre qualquer serviço municipal que não se encaixe em um órgão específico.",
    telefone: "0800 281 0040",
    email: "ouvidoria@recife.pe.gov.br",
    site: "ouvidoria.recife.pe.gov.br/registre-sua-manifestacao",
    endereco: "Consulte o portal para endereços de atendimento presencial",
    horario: "Seg. a sex., 8h às 17h",
  },
};
