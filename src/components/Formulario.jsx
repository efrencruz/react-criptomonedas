import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import useMoneda from './../hooks/useMoneda';
import useCriptomoneda from './../hooks/useCriptomoneda';
import PropTypes from 'prop-types';
import Error from './Error';
import axios from 'axios';

const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #fff;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #326ac0;
        cursor: pointer;
    }
`;

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {
    const [listaCripto, guardarListaCripto] = useState([]);

    const [error, guardarError] = useState(false);

    const MONEDAS = [
        { codigo: 'USD', nombre: 'Dolar de Estados Unidos' },
        { codigo: 'MXN', nombre: 'Peso Mexicano' },
        { codigo: 'EUR', nombre: 'Euro' },
        { codigo: 'GBP', nombre: 'Libra Esterlina' }
    ];

    // Utilizando el hook useMoneda
    const [moneda, SelectMoneda] = useMoneda('Elige tu moneda', '', MONEDAS);

    // Utilizando el hook useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu criptomoneda', '', listaCripto);

    // Ejecutar API
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
            const resultado = await axios.get(url);
            guardarListaCripto(resultado.data.Data);
        };
        consultarAPI();
    }, []);

    // Cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault();

        if (moneda === '' || criptomoneda === '') {
            guardarError(true);
            return;
        }
        // Pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    };

    return (
        <form onSubmit={cotizarMoneda}>
            {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}
            <SelectMoneda></SelectMoneda>
            <SelectCripto></SelectCripto>
            <Boton type="submit" value="Calcular"></Boton>
        </form>
    );
};

Formulario.propTypes = {
    guardarMoneda: PropTypes.func.isRequired,
    guardarCriptomoneda: PropTypes.func.isRequired
};

export default Formulario;
