import React, { useState, useEffect } from "react";

const GetCurrencyInfo = () => {
  const [currencyInfo, setCurrencyInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCurrencyInfo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json"
        );
        const dataJSON = await response.json();
        const data = dataJSON.value;
        setCurrencyInfo(data);
      } catch (error) {
        setMessage(error.message);
        return [];
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrencyInfo();
  }, []);

  return { currencyInfo, isLoading, message };
};

export default GetCurrencyInfo;
