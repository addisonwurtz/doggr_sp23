import { Migration } from '@mikro-orm/migrations';

export class Migration20230502002321 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "Messages" add column "message_id" serial not null;');
    this.addSql('alter table "Messages" drop constraint "Messages_pkey";');
    this.addSql('alter table "Messages" add constraint "Messages_pkey" primary key ("message_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "Messages" drop constraint "Messages_pkey";');
    this.addSql('alter table "Messages" drop column "message_id";');
    this.addSql('alter table "Messages" add constraint "Messages_pkey" primary key ("sender_id", "receiver_id", "created_at");');
  }

}
