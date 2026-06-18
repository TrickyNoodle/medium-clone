-- CreateTable
CREATE TABLE "posts" (
    "pid" SERIAL NOT NULL,
    "pname" TEXT NOT NULL,
    "pcontent" TEXT,
    "created" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "uid" INTEGER NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "users" (
    "uid" SERIAL NOT NULL,
    "uname" VARCHAR(50) NOT NULL,
    "uemail" VARCHAR(100) NOT NULL,
    "upassword" VARCHAR(300),
    "joined" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "follows" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "provider" VARCHAR(20) NOT NULL,
    "bio" VARCHAR(500),
    "image" TEXT DEFAULT '/default_avatar.png',

    CONSTRAINT "users_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uname_key" ON "users"("uname");

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_uemail_key" ON "users"("provider", "uemail");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE CASCADE ON UPDATE NO ACTION;

CREATE OR REPLACE FUNCTION remove_deleted_user_from_follows()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET follows = array_remove(follows, OLD.uid)
    WHERE OLD.uid = ANY(follows);

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_delete_cleanup
AFTER DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION remove_deleted_user_from_follows();
