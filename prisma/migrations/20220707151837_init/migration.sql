-- AlterTable
CREATE SEQUENCE "timelines_id_seq";
ALTER TABLE "TimeLines" ALTER COLUMN "id" SET DEFAULT nextval('timelines_id_seq');
ALTER SEQUENCE "timelines_id_seq" OWNED BY "TimeLines"."id";
