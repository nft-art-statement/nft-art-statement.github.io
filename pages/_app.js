import GlobalStyles from "../styles/GlobalStyles";
import { INFURA_ID } from "../config";
import { ChainId, DAppProvider } from "@usedapp/core";

const config = {
  // TODO switch to mainnet
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
};

const App = ({ Component, pageProps }) => {
  return (
    <DAppProvider config={config}>
      <GlobalStyles />
      <Component {...pageProps} />
    </DAppProvider>
  );
};

export default App;
