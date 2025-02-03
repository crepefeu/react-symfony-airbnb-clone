<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250203101229 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE address (id SERIAL NOT NULL, street_number VARCHAR(255) NOT NULL, street_name VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, state VARCHAR(255) NOT NULL, zipcode VARCHAR(20) NOT NULL, country VARCHAR(255) NOT NULL, location geometry(GEOMETRY, 0) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE amenity (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE booking (id SERIAL NOT NULL, property_id INT NOT NULL, guest_id INT NOT NULL, check_in_date DATE NOT NULL, check_out_date DATE NOT NULL, number_of_guests INT NOT NULL, total_price INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, status VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E00CEDDE549213EC ON booking (property_id)');
        $this->addSql('CREATE INDEX IDX_E00CEDDE9A4AA658 ON booking (guest_id)');
        $this->addSql('COMMENT ON COLUMN booking.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE property (id SERIAL NOT NULL, address_id INT NOT NULL, owner_id INT NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, price INT NOT NULL, max_guests INT NOT NULL, bedrooms INT NOT NULL, bathrooms INT NOT NULL, latitude DOUBLE PRECISION NOT NULL, longitude DOUBLE PRECISION NOT NULL, location geometry(GEOMETRY, 0) DEFAULT NULL, property_type VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_8BF21CDEF5B7AF75 ON property (address_id)');
        $this->addSql('CREATE INDEX IDX_8BF21CDE7E3C61F9 ON property (owner_id)');
        $this->addSql('COMMENT ON COLUMN property.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN property.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE property_amenity (property_id INT NOT NULL, amenity_id INT NOT NULL, PRIMARY KEY(property_id, amenity_id))');
        $this->addSql('CREATE INDEX IDX_F2AD331B549213EC ON property_amenity (property_id)');
        $this->addSql('CREATE INDEX IDX_F2AD331B9F9F1305 ON property_amenity (amenity_id)');
        $this->addSql('CREATE TABLE property_draft (id SERIAL NOT NULL, owner_id INT NOT NULL, data JSON NOT NULL, last_saved TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, current_step INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_806F57997E3C61F9 ON property_draft (owner_id)');
        $this->addSql('COMMENT ON COLUMN property_draft.last_saved IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE property_media (id SERIAL NOT NULL, property_id INT NOT NULL, url VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_AC3F6001549213EC ON property_media (property_id)');
        $this->addSql('CREATE TABLE review (id SERIAL NOT NULL, property_id INT NOT NULL, author_id INT NOT NULL, rating INT NOT NULL, comment TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_794381C6549213EC ON review (property_id)');
        $this->addSql('CREATE INDEX IDX_794381C6F675F31B ON review (author_id)');
        $this->addSql('COMMENT ON COLUMN review.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE "user" (id SERIAL NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, profile_picture VARCHAR(255) DEFAULT NULL, bio TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON "user" (email)');
        $this->addSql('COMMENT ON COLUMN "user".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE wishlist (id SERIAL NOT NULL, owner_id INT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_9CE12A317E3C61F9 ON wishlist (owner_id)');
        $this->addSql('COMMENT ON COLUMN wishlist.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE wishlist_item (id SERIAL NOT NULL, wishlist_id INT NOT NULL, property_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6424F4E8FB8E54CD ON wishlist_item (wishlist_id)');
        $this->addSql('CREATE INDEX IDX_6424F4E8549213EC ON wishlist_item (property_id)');
        $this->addSql('CREATE TABLE messenger_messages (id BIGSERIAL NOT NULL, body TEXT NOT NULL, headers TEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, available_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, delivered_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_75EA56E0FB7336F0 ON messenger_messages (queue_name)');
        $this->addSql('CREATE INDEX IDX_75EA56E0E3BD61CE ON messenger_messages (available_at)');
        $this->addSql('CREATE INDEX IDX_75EA56E016BA31DB ON messenger_messages (delivered_at)');
        $this->addSql('COMMENT ON COLUMN messenger_messages.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.available_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.delivered_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE OR REPLACE FUNCTION notify_messenger_messages() RETURNS TRIGGER AS $$
            BEGIN
                PERFORM pg_notify(\'messenger_messages\', NEW.queue_name::text);
                RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;');
        $this->addSql('DROP TRIGGER IF EXISTS notify_trigger ON messenger_messages;');
        $this->addSql('CREATE TRIGGER notify_trigger AFTER INSERT OR UPDATE ON messenger_messages FOR EACH ROW EXECUTE PROCEDURE notify_messenger_messages();');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDE9A4AA658 FOREIGN KEY (guest_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property ADD CONSTRAINT FK_8BF21CDEF5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property ADD CONSTRAINT FK_8BF21CDE7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property_amenity ADD CONSTRAINT FK_F2AD331B549213EC FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property_amenity ADD CONSTRAINT FK_F2AD331B9F9F1305 FOREIGN KEY (amenity_id) REFERENCES amenity (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property_draft ADD CONSTRAINT FK_806F57997E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE property_media ADD CONSTRAINT FK_AC3F6001549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C6549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C6F675F31B FOREIGN KEY (author_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wishlist ADD CONSTRAINT FK_9CE12A317E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wishlist_item ADD CONSTRAINT FK_6424F4E8FB8E54CD FOREIGN KEY (wishlist_id) REFERENCES wishlist (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE wishlist_item ADD CONSTRAINT FK_6424F4E8549213EC FOREIGN KEY (property_id) REFERENCES property (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE booking DROP CONSTRAINT FK_E00CEDDE549213EC');
        $this->addSql('ALTER TABLE booking DROP CONSTRAINT FK_E00CEDDE9A4AA658');
        $this->addSql('ALTER TABLE property DROP CONSTRAINT FK_8BF21CDEF5B7AF75');
        $this->addSql('ALTER TABLE property DROP CONSTRAINT FK_8BF21CDE7E3C61F9');
        $this->addSql('ALTER TABLE property_amenity DROP CONSTRAINT FK_F2AD331B549213EC');
        $this->addSql('ALTER TABLE property_amenity DROP CONSTRAINT FK_F2AD331B9F9F1305');
        $this->addSql('ALTER TABLE property_draft DROP CONSTRAINT FK_806F57997E3C61F9');
        $this->addSql('ALTER TABLE property_media DROP CONSTRAINT FK_AC3F6001549213EC');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C6549213EC');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C6F675F31B');
        $this->addSql('ALTER TABLE wishlist DROP CONSTRAINT FK_9CE12A317E3C61F9');
        $this->addSql('ALTER TABLE wishlist_item DROP CONSTRAINT FK_6424F4E8FB8E54CD');
        $this->addSql('ALTER TABLE wishlist_item DROP CONSTRAINT FK_6424F4E8549213EC');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE amenity');
        $this->addSql('DROP TABLE booking');
        $this->addSql('DROP TABLE property');
        $this->addSql('DROP TABLE property_amenity');
        $this->addSql('DROP TABLE property_draft');
        $this->addSql('DROP TABLE property_media');
        $this->addSql('DROP TABLE review');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE wishlist');
        $this->addSql('DROP TABLE wishlist_item');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
