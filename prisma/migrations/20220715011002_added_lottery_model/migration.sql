-- CreateTable
CREATE TABLE "lottery" (
    "id" VARCHAR(12) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "creator_id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lottery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery_participant" (
    "id" UUID NOT NULL,
    "lottery_id" VARCHAR NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "lottery_participant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lottery" ADD CONSTRAINT "lottery_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lottery_participant" ADD CONSTRAINT "lottery_participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lottery_participant" ADD CONSTRAINT "lottery_participant_lottery_id_fkey" FOREIGN KEY ("lottery_id") REFERENCES "lottery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
