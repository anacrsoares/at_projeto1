import { useState, useEffect } from 'react-native';

const GetDailyCurrencyQuote = async ({ moeda, dataCotacao }) => {
  const [dailyCurrency, setDailyCurrency] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  setIsLoading(true);
  try {
    const response = await fetch(
      ` https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moeda}'&@dataCotacao='${dataCotacao}'&$top=1&$format=json`
    );

    const dataJSON = await response.json();
    const data = dataJSON;
    setDailyCurrency(data);
  } catch (error) {
    setMessage(error.message);
  } finally {
    setIsLoading(false);
  }

  return data;
};

export default GetDailyCurrencyQuote;
