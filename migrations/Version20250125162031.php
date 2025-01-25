<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250125162031 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX uniq_8bf21cdef5b7af75');
        $this->addSql('ALTER TABLE property ADD property_type VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE property ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE property ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('COMMENT ON COLUMN property.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN property.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE INDEX IDX_8BF21CDEF5B7AF75 ON property (address_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP INDEX IDX_8BF21CDEF5B7AF75');
        $this->addSql('ALTER TABLE property DROP property_type');
        $this->addSql('ALTER TABLE property DROP created_at');
        $this->addSql('ALTER TABLE property DROP updated_at');
        $this->addSql('CREATE UNIQUE INDEX uniq_8bf21cdef5b7af75 ON property (address_id)');
    }
}
