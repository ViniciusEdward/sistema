-- Sistema Gestão Clientes - MySQL schema
-- Pronto para rodar no MySQL do Clever Cloud via MySQL Workbench.
-- Execute antes do seed.sql.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL DEFAULT 'Administrador',
  email VARCHAR(180) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  telefone VARCHAR(30),
  dia_pagamento SMALLINT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  status ENUM('ATIVO', 'INATIVO', 'INADIMPLENTE') NOT NULL DEFAULT 'ATIVO',
  observacoes TEXT,
  data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT chk_clientes_dia_pagamento CHECK (dia_pagamento BETWEEN 1 AND 31),
  CONSTRAINT chk_clientes_valor CHECK (valor >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mensalidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  competencia DATE NOT NULL,
  vencimento DATE NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  status ENUM('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  pago_em DATETIME(6),
  forma_pagamento ENUM('PIX', 'DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'OUTRO'),
  observacoes TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT mensalidades_cliente_competencia_unique UNIQUE (cliente_id, competencia),
  CONSTRAINT fk_mensalidades_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  CONSTRAINT chk_mensalidades_valor CHECK (valor >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Decisão de modelagem: pagamentos ficam em tabela própria para auditoria/histórico.
-- A mensalidade guarda status/pago_em/forma_pagamento para leitura rápida, mas o pagamento
-- é o registro financeiro ligado ao caixa.
CREATE TABLE IF NOT EXISTS pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mensalidade_id INT NOT NULL UNIQUE,
  cliente_id INT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  pago_em DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  forma_pagamento ENUM('PIX', 'DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA', 'OUTRO') NOT NULL,
  observacao TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_pagamentos_mensalidade FOREIGN KEY (mensalidade_id) REFERENCES mensalidades(id) ON DELETE RESTRICT,
  CONSTRAINT fk_pagamentos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
  CONSTRAINT chk_pagamentos_valor CHECK (valor >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categorias_despesa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL UNIQUE,
  cor VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS despesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT,
  destino VARCHAR(160) NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  data DATE NOT NULL DEFAULT (CURRENT_DATE),
  observacao TEXT,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_despesas_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_despesa(id) ON DELETE SET NULL,
  CONSTRAINT chk_despesas_valor CHECK (valor >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS caixa_transacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
  origem ENUM('MENSALIDADE', 'DESPESA', 'AJUSTE') NOT NULL,
  descricao VARCHAR(220) NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  data_transacao DATE NOT NULL DEFAULT (CURRENT_DATE),
  mensalidade_id INT UNIQUE,
  despesa_id INT UNIQUE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_caixa_mensalidade FOREIGN KEY (mensalidade_id) REFERENCES mensalidades(id) ON DELETE SET NULL,
  CONSTRAINT fk_caixa_despesa FOREIGN KEY (despesa_id) REFERENCES despesas(id) ON DELETE SET NULL,
  CONSTRAINT chk_caixa_valor CHECK (valor >= 0),
  CONSTRAINT chk_caixa_transacao_referencia CHECK (
    (origem = 'MENSALIDADE' AND mensalidade_id IS NOT NULL)
    OR (origem = 'DESPESA' AND despesa_id IS NOT NULL)
    OR (origem = 'AJUSTE')
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_mensalidades_cliente_id ON mensalidades(cliente_id);
CREATE INDEX idx_mensalidades_vencimento ON mensalidades(vencimento);
CREATE INDEX idx_mensalidades_status ON mensalidades(status);
CREATE INDEX idx_mensalidades_competencia ON mensalidades(competencia);
CREATE INDEX idx_pagamentos_pago_em ON pagamentos(pago_em);
CREATE INDEX idx_caixa_data_tipo ON caixa_transacoes(data_transacao, tipo);
CREATE INDEX idx_despesas_data ON despesas(data);

COMMIT;
