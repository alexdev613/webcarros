import { useEffect, useState } from 'react';
import { Container } from '../../components/container';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaExpandAlt } from 'react-icons/fa';

import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

import { ImageModal } from '../../components/imagemodal/index';

import { Swiper, SwiperSlide } from 'swiper/react';

interface CarProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: ImagesCarProps[];
}

interface ImagesCarProps {
  uid: string;
  name: string;
  url: string;
}

export function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState<CarProps>();

  const [sliderPreview, setSliderPreview] = useState<number>(2);
  const navigate = useNavigate();

  const [isImageModalOpen, setIsImageModal] = useState(false);
  const [url, setUrl] = useState("");

  function closeModal() {
    setIsImageModal(false);
  }
  
  useEffect( () => {
    async function loadCar() {
      if(!id) { return }; // Se não houver id na rota para a execução (nem tenta carregar nada!)

      const docRef = doc(db, "cars", id);
  
      getDoc(docRef)
      .then((snapshot) => {

        if(!snapshot.data()) {
          navigate("/");
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data()?.year,
          city: snapshot.data()?.city,
          model: snapshot.data()?.model,
          uid: snapshot.data()?.uid,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          whatsapp: snapshot.data()?.whatsapp,
          price: snapshot.data()?.price,
          km: snapshot.data()?.km,
          owner: snapshot.data()?.owner,
          images: snapshot.data()?.images,
        })
      })

    }

    loadCar();

  }, [id]);

  useEffect( () => {

    function handleResize() {
      if(window.innerWidth < 720) {
        setSliderPreview(1);
      } else {
        setSliderPreview(2);
      }
    }

    handleResize();

    // Para que toda vez que atualizemos o tamanho da tela a função handleResize seja chamada:
    window.addEventListener("resize", handleResize);

    // Para quando desmotarmos o componente CarDetails o evento seja removido evitando um monitoramento desnecessário:
    return() => {
      window.removeEventListener("resize", handleResize);
    }

  }, []);

  function handleModal(url: string): void {
    setIsImageModal(true);
    setUrl(url);
    console.log(`Olá: ${url}`)
  }

  return (
    <Container>
      
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={closeModal}
      >
        <img
          src={url}
          alt={url}
          className='max-h-[80vh] w-full object-contain rounded-lg'
          draggable={false}
        />
      </ImageModal>
      
      { car && (
        <Swiper
          slidesPerView={sliderPreview}
          pagination={{ clickable: true }}
          navigation
        >
          {car?.images.map( image => (
            <SwiperSlide key={image.name} >
              <div className='relative flex justify-center items-center'>
                <img
                  src={image.url}
                  className='w-full h-96 object-cover'
                />
                <div
                  className='absolute bg-slate-400 hover:bg-slate-50 hover:scale-125 duration-700 h-8 flex justify-center items-center rounded-lg w-8'
                  onClick={() => handleModal(image.url)}
                >
                  <FaExpandAlt size={26} color="#666" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      { car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className='font-bold text-3xl text-black'>{car?.name}</h1>
            <h1 className='font-bold text-3xl text-black'>R$ {car?.price}</h1>
          </div>
          <p>{car?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
              <div>
                <p>Proprietário:</p>
                <strong>{car?.owner}</strong>
              </div>
            </div>

          </div>

          <strong>Descrição:</strong>
          <p className="mb-4">{car?.description}</p>

          <strong>Telefone / WhatsApp</strong>
          <p>{car?.whatsapp}</p>

          <Link
            to={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi esse ${car?.name} no site WebCarros e fiquei interessado!`}
            target='_blank'
            className='bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium'
          >
            Conversar com o vendedor
            <FaWhatsapp size={26} color="#FFF" />
          </Link>

        </main>
      )}
    </Container>
  )
}