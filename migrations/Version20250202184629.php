<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250202184629 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE property_amenities DROP CONSTRAINT fk_9a9f56ca549213ec');
        $this->addSql('ALTER TABLE property_amenities DROP CONSTRAINT fk_9a9f56ca9f9f1305');
        $this->addSql('DROP TABLE property_amenities');
        $this->addSql('ALTER TABLE amenity DROP CONSTRAINT fk_ab607963549213ec');
        $this->addSql('DROP INDEX idx_ab607963549213ec');
        $this->addSql('ALTER TABLE amenity DROP property_id');
        $this->addSql('ALTER INDEX idx_8e749c65549213ec RENAME TO IDX_F2AD331B549213EC');
        $this->addSql('ALTER INDEX idx_8e749c659f9f1305 RENAME TO IDX_F2AD331B9F9F1305');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE TABLE property_amenities (property_id INT NOT NULL, amenity_id INT NOT NULL, PRIMARY KEY(property_id, amenity_id))');
        $this->addSql('CREATE INDEX idx_9a9f56ca9f9f1305 ON property_amenities (amenity_id)');
        $this->addSql('CREATE INDEX idx_9a9f56ca549213ec ON property_amenities (property_id)');
        $this->addSql('ALTER TABLE property_amenities ADD CONSTRAINT fk_9a9f56ca549213ec FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property_amenities ADD CONSTRAINT fk_9a9f56ca9f9f1305 FOREIGN KEY (amenity_id) REFERENCES amenity (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER INDEX idx_f2ad331b9f9f1305 RENAME TO idx_8e749c659f9f1305');
        $this->addSql('ALTER INDEX idx_f2ad331b549213ec RENAME TO idx_8e749c65549213ec');
        $this->addSql('ALTER TABLE amenity ADD property_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE amenity ADD CONSTRAINT fk_ab607963549213ec FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_ab607963549213ec ON amenity (property_id)');
    }
}
