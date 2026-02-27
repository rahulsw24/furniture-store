import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_orders_order_status";
  CREATE TYPE "public"."enum_orders_order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned');
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'pending'::"public"."enum_orders_order_status";
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE "public"."enum_orders_order_status" USING "order_status"::"public"."enum_orders_order_status";
  ALTER TABLE "media" ADD COLUMN "cloudinary_url" varchar;
  ALTER TABLE "products" ADD COLUMN "dimensions" varchar;
  ALTER TABLE "products" ADD COLUMN "materials" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "inquiries_id" integer;
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  ALTER TABLE "users" DROP COLUMN "low_stock_threshold";
  ALTER TABLE "media" DROP COLUMN "public_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiries" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "inquiries" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_inquiries_fk";
  
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_orders_order_status";
  CREATE TYPE "public"."enum_orders_order_status" AS ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Returned');
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'pending'::"public"."enum_orders_order_status";
  ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE "public"."enum_orders_order_status" USING "order_status"::"public"."enum_orders_order_status";
  DROP INDEX "payload_locked_documents_rels_inquiries_id_idx";
  ALTER TABLE "users" ADD COLUMN "low_stock_threshold" numeric DEFAULT 5;
  ALTER TABLE "media" ADD COLUMN "public_id" varchar;
  ALTER TABLE "media" DROP COLUMN "cloudinary_url";
  ALTER TABLE "products" DROP COLUMN "dimensions";
  ALTER TABLE "products" DROP COLUMN "materials";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "inquiries_id";`)
}
