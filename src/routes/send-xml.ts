import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { BadRequest } from './_erros/bad-request';
import { verifyJwt } from '../middlewares/JWTAuth';

export async function sendXML(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/xml',
    {
      onRequest: [verifyJwt],
      schema: {
        body: z.object({
          imovelId: z.number().int(),
          value: z.string()
        })
      }
    },
    async (req, rep) => {
      const { imovelId, value } = req.body as {
        imovelId: number;
        value: string;
      };

      if (!imovelId || !value) {
        throw new BadRequest('O id do imóvel e o valor são obrigatórios!');
      }

      const filePath = path.resolve('./files', `imovel_${imovelId}.xml`);

      const imovel = await prisma.imovel.findUnique({
        where: {
          id: imovelId
        }
      });

      const tomador = await prisma.tomador.findUnique({
        where: {
          id: imovel?.tomadorId
        }
      });

      const data = `<?xml version="1.0" encoding="ISO-8859-1"?>
      <nfse>
      <nf>
          <valor_total>${value}</valor_total>
          <valor_desconto>0,00</valor_desconto>
          <valor_ir>0,00</valor_ir>
          <valor_inss>0,00</valor_inss>
          <valor_contribuicao_social>0,00</valor_contribuicao_social>
          <valor_rps>0,00</valor_rps>
          <valor_pis>0,00</valor_pis>
          <valor_cofins>0,00</valor_cofins>
          <observacao>IMOVEL: ${imovel?.endereco}</observacao>
      </nf>
      <prestador>
          <cpfcnpj>${process.env.LOGIN}</cpfcnpj>
          <cidade>${process.env.CIDADE_PRESTADOR}</cidade>
      </prestador>
      <tomador>
          <tipo>${tomador?.type}</tipo>
          <cpfcnpj>${tomador?.cpf_cnpj}</cpfcnpj>
          <ie></ie>
          <nome_razao_social>${tomador?.nome_razao_social}</nome_razao_social>
          <sobrenome_nome_fantasia></sobrenome_nome_fantasia>
          <logradouro>${tomador?.logradouro}</logradouro>
          <email></email>
          <complemento></complemento>
          <ponto_referencia></ponto_referencia>
          <bairro>${tomador?.bairro}</bairro>
          <cidade>${tomador?.cod_cidade}</cidade>
          <cep>${tomador?.cep}</cep>
          <ddd_fone_comercial></ddd_fone_comercial>
          <fone_comercial></fone_comercial>
          <ddd_fone_residencial></ddd_fone_residencial>
          <fone_residencial></fone_residencial>
          <ddd_fax></ddd_fax>
          <fone_fax></fone_fax>
      </tomador>
      <itens>
          <lista>
          <codigo_local_prestacao_servico>${imovel?.cod_loc}</codigo_local_prestacao_servico>
          <codigo_item_lista_servico>1712</codigo_item_lista_servico>
          <descritivo>Administracao Locacao</descritivo>
          <aliquota_item_lista_servico>${process.env.ALIQUOTA}</aliquota_item_lista_servico>
          <situacao_tributaria>00</situacao_tributaria>
          <valor_tributavel>${value}</valor_tributavel>
          <valor_deducao>0,00</valor_deducao>
          <valor_issrf>0,00</valor_issrf>
          <tributa_municipio_prestador>S</tributa_municipio_prestador>
          <unidade_codigo/>
          <unidade_quantidade/>
          <unidade_valor_unitario/>                    
          </lista>
      </itens>
      <produtos>
      </produtos>
      </nfse>
      `;

      try {
        fs.writeFileSync(filePath, data);
        const formData = new FormData();

        formData.append('login', process.env.LOGIN);
        formData.append('senha', process.env.SENHA);
        formData.append(
          'f1',
          fs.createReadStream(`./files/imovel_${imovelId}.xml`)
        );

        const response = await axios.post(
          'http://sync.nfs-e.net/datacenter/include/nfw/importa_nfw/nfw_import_upload.php',
          formData,
          { headers: { ...formData.getHeaders() } }
        );

        if (response.status >= 200 && response.status < 300) {
          return rep
            .status(201)
            .send({ message: 'Nota criada com sucesso', data: response.data });
        } else {
          throw new Error('Erro ao criar nota');
        }
      } catch (error) {
        console.error('Erro ao gerar o arquivo: ', error);
        throw new Error('Erro ao gerar o arquivo');
      }
    }
  );
}
