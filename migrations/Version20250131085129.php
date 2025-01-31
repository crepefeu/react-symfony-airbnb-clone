<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250131085129 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE property_media (id SERIAL NOT NULL, property_id INT NOT NULL, url VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_AC3F6001549213EC ON property_media (property_id)');
        $this->addSql('CREATE TABLE wishlist (id SERIAL NOT NULL, owner_id INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_9CE12A317E3C61F9 ON wishlist (owner_id)');
        $this->addSql('COMMENT ON COLUMN wishlist.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE wishlist_item (id SERIAL NOT NULL, wishlist_id INT NOT NULL, property_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6424F4E8FB8E54CD ON wishlist_item (wishlist_id)');
        $this->addSql('CREATE INDEX IDX_6424F4E8549213EC ON wishlist_item (property_id)');
        $this->addSql('ALTER TABLE property_media ADD CONSTRAINT FK_AC3F6001549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wishlist ADD CONSTRAINT FK_9CE12A317E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wishlist_item ADD CONSTRAINT FK_6424F4E8FB8E54CD FOREIGN KEY (wishlist_id) REFERENCES wishlist (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wishlist_item ADD CONSTRAINT FK_6424F4E8549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property DROP images');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE property_media DROP CONSTRAINT FK_AC3F6001549213EC');
        $this->addSql('ALTER TABLE wishlist DROP CONSTRAINT FK_9CE12A317E3C61F9');
        $this->addSql('ALTER TABLE wishlist_item DROP CONSTRAINT FK_6424F4E8FB8E54CD');
        $this->addSql('ALTER TABLE wishlist_item DROP CONSTRAINT FK_6424F4E8549213EC');
        $this->addSql('DROP TABLE property_media');
        $this->addSql('DROP TABLE wishlist');
        $this->addSql('DROP TABLE wishlist_item');
        $this->addSql('ALTER TABLE property ADD images JSON DEFAULT NULL');
    }
}
