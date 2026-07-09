-- Seed inicial MySQL: categorias padrão e usuário de desenvolvimento.
-- Em produção, prefira criar/atualizar o usuário único via variáveis ADMIN_EMAIL + ADMIN_PASSWORD ou ADMIN_PASSWORD_HASH no backend.
-- Login dev deste seed: admin@sistema.local / Admin@123456
-- O hash também pode ser gerado com: cd backend && npm run hash:password -- Admin@123456

SET NAMES utf8mb4;
START TRANSACTION;

INSERT IGNORE INTO usuarios (nome, email, senha_hash, ativo)
VALUES (
  'Administrador',
  'admin@sistema.local',
  '$2b$10$XqF8eQ0mgoP7R3WRF9V40uRV7QBdK4YJnZ3INHzlp5UktI9Z2Y0ba',
  TRUE
);

INSERT IGNORE INTO categorias_despesa (nome, cor) VALUES
  ('Internet e sistemas', '#3B82F6'),
  ('Equipamentos', '#22D3EE'),
  ('Transporte', '#FBBF24'),
  ('Marketing', '#A78BFA'),
  ('Outros', '#94A3B8');

COMMIT;
