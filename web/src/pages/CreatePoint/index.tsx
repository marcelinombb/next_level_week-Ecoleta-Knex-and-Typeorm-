import React,{useEffect,useState,ChangeEvent, FormEvent} from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import {Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {Map,TileLayer,Marker} from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import {LeafletMouseEvent} from  'leaflet'

interface Item{
    id:number;
    title:string;
    url_image:string;
}

interface UF{
    sigla:string;
}

interface Cities{
    nome:string;
}

const CreatePoint = () =>{

    const [items,setItems] = useState<Item[]>([]);
    const [UFS,setUFs] = useState<string[]>([]);
    const [Cities,setCities] = useState<string[]>([]);
    const [selectedUF,setSelectedUf] = useState('0');
    const [selectedCity,setSelectedCity] = useState('0');
    const [selectedItems,setSelectedItems] = useState<number[]>([])
    const [selectedPosition,setSelectedPosition] = useState<[number,number]>([0,0]);
    const [formData,setFormData] = useState({
        name:"",
        email:"",
        whatsapp:''
    })
    useEffect(()=>{
        api.get("items").then(response =>{
            setItems(response.data);
        })
    },[]);


    useEffect(()=>{
        axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response=>{
            const ufInitials = response.data.map(uf=>uf.sigla);
            setUFs(ufInitials);
        })
    },[]);

    useEffect(()=>{

        if(selectedUF==='0') return

        axios.get<Cities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        .then(response=>{
            const citiesNames = response.data.map(city=>city.nome);
            setCities(citiesNames);
        })
    },[selectedUF]);

    function handleSelectUf(event:ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event:ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleInput(event:ChangeEvent<HTMLInputElement>){
       const {name,value} = event.target;
       setFormData({...formData,[name]:value})
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([event.latlng.lat,event.latlng.lng])
    }

    function handleSeletedItem(id:number){
        const AlreadySelected = selectedItems.findIndex(item => item === id);
        if(AlreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item!==id)
            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems,id]);
        }
    }

   async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const {name,email,whatsapp} = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude,longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

       await api.post("points",data);

        console.log(data)
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to='/'>
                    <FiArrowLeft/> 
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name='name' id='name' onChange={handleInput}/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name='email' id='email' onChange={handleInput}/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name='whatsapp' id='whatsapp' onChange={handleInput}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o Endereço no mapa</span>
                    </legend>
                        <Map center={[-23.5434324,-46.6385462]} zoom={15} onClick={handleMapClick}>
                            <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedPosition}/>
                        </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUf}>
                                <option value="0" disabled>Selecione uma UF</option>
                                {
                                    UFS.map(uf=>(
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectCity}>
                            <option value="0" disabled>Selecione uma Cidade</option>
                                {
                                    Cities.map(city=>(
                                    <option key={city} value={city}>{city}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className='items-grid'>
                        {
                        items.map(item => (
                            <li className={selectedItems.includes(item.id)? "selected" : ""} key={item.id} onClick={()=>handleSeletedItem(item.id)}>
                                <img src={item.url_image} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))
                        }                      
                    </ul>
                </fieldset>
                <button type='submit' >
                    Cadastrar ponto de coleta
                </button>
            </form>
            
        </div>
    );
}

export default CreatePoint;