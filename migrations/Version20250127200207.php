<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250127200207 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE property ADD images JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD profile_picture VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD bio TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA topology');
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE topology.topology_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('ALTER TABLE "user" DROP profile_picture');
        $this->addSql('ALTER TABLE "user" DROP bio');
        $this->addSql('ALTER TABLE property DROP images');
    }
}
