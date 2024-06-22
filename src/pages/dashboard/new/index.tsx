import { ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/painelheader";
import { Input } from "../../../components/input";

import { FiUpload } from "react-icons/fi";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidV4 } from 'uuid';

import { storage } from '../../../services/firebaseConnection';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

import { AuthContext } from "../../../contexts/AuthContext";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O modelo do veículo é obrigatório"),
  year: z.string().min(2, "O ano do carro é obrigatório"),
  km: z.string().min(1, 'O KM do veículo é obrigatório'),
  price: z.string().min(1, "O preço é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  whatsapp: z.string().min(1, "O telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
    message: "Número de telefone inválido."
  }),
  description: z.string().min(1, "A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

export function New() {
  const {user} = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if(e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png') {
        // Enviar pro banco a imagem...
        await handleUpload(image);
      } else {
        alert("Envie uma imagem jpeg ou png!");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    // Se por qualquer motivo não tenha um uid de user, como falha no servidor do google para por aqui:
    if(!user?.uid) {
      return;
    }

    // se tiver user.uid então seguimos aqui:

    // Importante: instalar a lib uuid e a sua tipagem @types/uuid, para evitar salvar duas imagens com mesmo nome e
    // a última sobrescrever a primeira. Ela tema a função de criar um nome aleatório para cada arquivo enviado

    const currentUid = user?.uid; // o usuário/dono da imagem
    const uidImage = uuidV4(); // será gerado nessa variável um id aleatório para essa imagem que nunca vai se repetir

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        console.log("URL DE ACESSO DA FOTO ", downloadUrl);
      })
    })

  }

  function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <Container>
      <DashboardHeader />
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
            type="file"
            accept="image/"
            className="opacity-0 cursor-pointer"
            onChange={handleFile}
          />
          </div>
        </button>
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <label className="mb-2 font-medium">Nome do carro</label>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex.: Onix 1.0..."
            />
          </div>

          <div className="mb-3">
            <label className="mb-2 font-medium">Modelo do carro</label>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex.: 1.0 Flex Plus Manual"
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <label className="mb-2 font-medium">Ano</label>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex.: 2016/2016"
              />
            </div>

            <div className="w-full">
              <label className="mb-2 font-medium">KM rodados</label>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex.: 23.900"
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <label className="mb-2 font-medium">Telefone / Whatsapp</label>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex.: 011980292460"
              />
            </div>

            <div className="w-full">
              <label className="mb-2 font-medium">Cidade</label>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex.: São Bernardo do Campo - SP"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-2 font-medium">Preço</label>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex.: Onix 1.0..."
            />
          </div>

          <div className="mb-3">
            <label className="mb-2 font-medium">Nome do carro</label>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa dobre seu carro..."
            />
            {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
          </div>

          <button className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium">
            Cadastrar
          </button>

        </form>
      </div>
    </Container>
  )
}