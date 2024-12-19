import { useState, useEffect } from "react";

const GetDailyCurrencyQuote = ({ moedaCotacao, dataCotacao }) => {
  const [cotacao, setCotacao] = useState({
    cotacaoCompra: null,
    cotacaoVenda: null,
  });
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDailyCurrencyQuote = async () => {
      if (!moedaCotacao || !dataCotacao) {
        setMessage("Moeda ou data não fornecida.");
        return;
      }

      setIsLoading(true);
      try {
        const generatedUrl = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moedaCotacao}'&@dataCotacao='${dataCotacao}'&$top=1&$format=json`;
        setUrl(generatedUrl);

        const response = await fetch(generatedUrl);

        if (!response.ok) {
          throw new Error("Erro ao buscar a cotação da moeda.");
        }

        const dataJSON = await response.json();

        if (!dataJSON.value || dataJSON.value.length === 0) {
          throw new Error("Nenhuma cotação encontrada.");
        }

        const { cotacaoCompra, cotacaoVenda } = dataJSON.value[0];
        setCotacao({ cotacaoCompra, cotacaoVenda });
      } catch (error) {
        setMessage(error.message);
        setCotacao({ cotacaoCompra: null, cotacaoVenda: null });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyCurrencyQuote();
  }, [moedaCotacao, dataCotacao]);

  return { cotacao, url };
};

export default GetDailyCurrencyQuote;
