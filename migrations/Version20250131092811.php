<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250131092811 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE booking ADD property_id INT NOT NULL');
        $this->addSql('ALTER TABLE booking ADD guest_id INT NOT NULL');
        $this->addSql('ALTER TABLE booking ADD status VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE9A4AA658 FOREIGN KEY (guest_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_E00CEDDE549213EC ON booking (property_id)');
        $this->addSql('CREATE INDEX IDX_E00CEDDE9A4AA658 ON booking (guest_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE booking DROP CONSTRAINT FK_E00CEDDE549213EC');
        $this->addSql('ALTER TABLE booking DROP CONSTRAINT FK_E00CEDDE9A4AA658');
        $this->addSql('DROP INDEX IDX_E00CEDDE549213EC');
        $this->addSql('DROP INDEX IDX_E00CEDDE9A4AA658');
        $this->addSql('ALTER TABLE booking DROP property_id');
        $this->addSql('ALTER TABLE booking DROP guest_id');
        $this->addSql('ALTER TABLE booking DROP status');
    }
}
