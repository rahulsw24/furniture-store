import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "business_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"gst_number" varchar,
  	"gst_percentage" numeric DEFAULT 18,
  	"company_address" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "promo_bar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"valid_until" timestamp(3) with time zone,
  	"fallback_text" varchar DEFAULT 'BOLTLESS: THE FUTURE OF TOOL-FREE ASSEMBLY' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "products" ADD COLUMN "highlights" varchar;
  ALTER TABLE "orders" ADD COLUMN "coupon_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "subscribers_id" integer;
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  ALTER TABLE "orders" ADD CONSTRAINT "orders_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "orders_coupon_idx" ON "orders" USING btree ("coupon_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "subscribers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "business_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "promo_bar" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "business_settings" CASCADE;
  DROP TABLE "promo_bar" CASCADE;
  ALTER TABLE "orders" DROP CONSTRAINT "orders_coupon_id_coupons_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_subscribers_fk";
  
  DROP INDEX "orders_coupon_idx";
  DROP INDEX "payload_locked_documents_rels_subscribers_id_idx";
  ALTER TABLE "products" DROP COLUMN "highlights";
  ALTER TABLE "orders" DROP COLUMN "coupon_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "subscribers_id";`)
}
