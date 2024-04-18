-- CreateEnum
CREATE TYPE "Type" AS ENUM ('F', 'J');

-- CreateTable
CREATE TABLE "Tomador" (
    "id" SERIAL NOT NULL,
    "type" "Type" NOT NULL,
    "cpf_cnpj" TEXT NOT NULL,
    "nome_razao_social" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cod_cidade" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Tomador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id" SERIAL NOT NULL,
    "cod_loc" INTEGER NOT NULL,
    "endereco" TEXT NOT NULL,
    "tomadorId" INTEGER NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tomador_cpf_cnpj_key" ON "Tomador"("cpf_cnpj");

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_tomadorId_fkey" FOREIGN KEY ("tomadorId") REFERENCES "Tomador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
