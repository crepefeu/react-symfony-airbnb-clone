<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250203204931 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE property_draft (id SERIAL NOT NULL, owner_id INT NOT NULL, data JSON NOT NULL, last_saved TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, current_step INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_806F57997E3C61F9 ON property_draft (owner_id)');
        $this->addSql('COMMENT ON COLUMN property_draft.last_saved IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE property_draft ADD CONSTRAINT FK_806F57997E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE property_draft DROP CONSTRAINT FK_806F57997E3C61F9');
        $this->addSql('DROP TABLE property_draft');
    }
}
