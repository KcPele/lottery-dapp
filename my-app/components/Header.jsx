
import { ConnectButton } from "web3uikit"

export default function Header() {
  return (
    <div className="border-b-2 flex flex-row justify-between items-center">
    <h2 className="">Lottery Dapp</h2>
      <ConnectButton moralisAuth={false}/>
    </div>
  )
}


