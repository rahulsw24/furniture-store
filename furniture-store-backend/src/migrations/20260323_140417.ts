import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "payment_details_failure_reason" varchar;
  ALTER TABLE "orders" ADD COLUMN "payment_details_error_code" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" DROP COLUMN "payment_details_failure_reason";
  ALTER TABLE "orders" DROP COLUMN "payment_details_error_code";`)
}
