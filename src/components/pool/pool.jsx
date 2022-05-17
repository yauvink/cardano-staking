import React, { useEffect, useState } from 'react';
import tokenLogo from '../../assets/tokenLogo.svg';

export function Pool({ nami, stakeAddress, setStakeAddress, setOpen }) {
  const [amount, setAmount] = useState();
  const getAddressAmount = async (address) => {
    return await nami.getAddressAmount(address).then((result) => result);
  };

  useEffect(() => {
    if (nami && stakeAddress) {
      getAddressAmount(stakeAddress).then((res) => {
        setAmount(res.amount[0].quantity);
      });
    }
  }, [nami]);

  return (
    <div className="pool">
       <img src={tokenLogo} alt="token logo" />
      {`${stakeAddress.substring(0, 20)}....${stakeAddress.substring(stakeAddress.length - 20)}`}
      <span>Amount: {amount / 1000000}</span>
      <button
        className="button stakeButton"
        onClick={() => {
          setStakeAddress(stakeAddress);
          setOpen(true);
        }}
      >
        Stake
      </button>
    </div>
  );
}
