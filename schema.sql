-- Security Woman - esquema inicial MySQL
-- Gerado a partir do modelo visual do BR Modelo.
-- Execute em um banco de desenvolvimento antes de usar em produção.

CREATE DATABASE IF NOT EXISTS security_woman
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE security_woman;

-- Administradores que podem acessar o painel.
CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL,
  telefone VARCHAR(20) NULL,
  data_nascimento DATE NULL,
  senha_hash VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'admin',
  cidade VARCHAR(100) NULL,
  estado VARCHAR(10) NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  KEY idx_usuarios_ativo (ativo)
) ENGINE=InnoDB;

-- Denúncias enviadas pelo site. usuario_id é o administrador responsável,
-- não a pessoa que realizou a denúncia. Por isso começa como NULL.
CREATE TABLE IF NOT EXISTS denuncias (
  id BIGINT NOT NULL AUTO_INCREMENT,
  usuario_id INT NULL,
  anonima BOOLEAN NOT NULL DEFAULT TRUE,
  nome_denunciante VARCHAR(150) NULL,
  relato TEXT NOT NULL,
  local_ocorrido VARCHAR(200) NULL,
  data_ocorrido DATE NULL,
  perigo_atual VARCHAR(30) NULL,
  contato_seguro BOOLEAN NOT NULL DEFAULT FALSE,
  meio_contato VARCHAR(200) NULL,
  horario_seguro VARCHAR(100) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Nova',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_denuncias_usuario (usuario_id),
  KEY idx_denuncias_status (status),
  KEY idx_denuncias_criado_em (criado_em),
  CONSTRAINT fk_denuncias_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Categorias de violência disponíveis no formulário.
CREATE TABLE IF NOT EXISTS tipos_violencia (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tipos_violencia_nome (nome)
) ENGINE=InnoDB;

-- Relação muitos-para-muitos: uma denúncia pode ter vários tipos.
CREATE TABLE IF NOT EXISTS denuncia_tipos (
  denuncia_id BIGINT NOT NULL,
  tipo_violencia_id INT NOT NULL,
  PRIMARY KEY (denuncia_id, tipo_violencia_id),
  KEY idx_denuncia_tipos_tipo (tipo_violencia_id),
  CONSTRAINT fk_denuncia_tipos_denuncia
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_denuncia_tipos_tipo
    FOREIGN KEY (tipo_violencia_id) REFERENCES tipos_violencia(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Histórico para rastrear mudanças de status e responsáveis.
CREATE TABLE IF NOT EXISTS historico_denuncias (
  id BIGINT NOT NULL AUTO_INCREMENT,
  denuncia_id BIGINT NOT NULL,
  usuario_id INT NULL,
  status_anterior VARCHAR(20) NULL,
  status_novo VARCHAR(20) NOT NULL,
  observacao TEXT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_historico_denuncia (denuncia_id),
  KEY idx_historico_usuario (usuario_id),
  CONSTRAINT fk_historico_denuncia
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_historico_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Categorias iniciais usadas pelo formulário do Security Woman.
INSERT IGNORE INTO tipos_violencia (nome) VALUES
  ('Física'),
  ('Patrimonial'),
  ('Psicológica'),
  ('Assédio'),
  ('Sexual'),
  ('Moral'),
  ('Outro');

-- Segurança: não cadastre senhas em texto puro.
-- Crie o primeiro administrador pela aplicação, usando bcrypt para gerar senha_hash.
