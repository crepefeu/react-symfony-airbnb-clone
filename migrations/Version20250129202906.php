<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250129202906 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE property_media (id SERIAL NOT NULL, property_id INT NOT NULL, url VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_AC3F6001549213EC ON property_media (property_id)');
        $this->addSql('ALTER TABLE property_media ADD CONSTRAINT FK_AC3F6001549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE topology.topology_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('ALTER TABLE property_media DROP CONSTRAINT FK_AC3F6001549213EC');
        $this->addSql('DROP TABLE property_media');
    }
}
