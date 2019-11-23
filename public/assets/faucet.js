const provider = 'http://localhost';
// const provider = 'http://192.168.1.175';

(d => {
    d.getElementById('faucet-form').addEventListener('submit', onSubmit)
    d.getElementById('address-input').addEventListener('input', onChange)

    function onSubmit(event) {
        event.preventDefault();
        const input = event.target.getElementsByTagName("input")[0];
        const address = input.value ? isValidAddress(input.value) : false;
        const errorRendered = d.getElementById('error-input');
        if(!address && !errorRendered) {
            event.target.getElementsByTagName("fieldset")[0].insertAdjacentElement('afterend', getErrorInput());
            return;
        }
        if(address && !!errorRendered) {
            errorRendered.remove();
        }
        const button = document.getElementById('form-submit');
        button.replaceWith(getLoader());
        fetch('http://localhost:5855/send-coins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address
            })
        }).then( response => response.json() )
        .then(response => {
            if(response.error) {
                event.target.getElementsByTagName("fieldset")[0].insertAdjacentElement('afterend', getErrorInput(response.error.message));
                event.target.getElementsByClassName("lds-ellipsis")[0].replaceWith(button);
                return;
            }
            if(response.tx) {
                getSuccessMessage(address, response.tx);
                return;
            }
        })
        .catch(err => {
            console.log(err);
            event.target.getElementsByClassName("lds-ellipsis")[0].replaceWith(button);
        });
    }
    
    function onChange(event) {
        if(event.target.value) {
            if(event.target.value.length > 0) {
                event.target.value = '0x' + event.target.value.replace(/0x|[^0-9a-f]/gi, '');
            }
        }
    }

    function isValidAddress(address) {
        const unprefixedAddress = address.replace(/^0x/, '');
        if (/^([A-Fa-f0-9]{40})$/.test(unprefixedAddress))
            return unprefixedAddress;
        else
            return false;
    }

    function getErrorInput(errorText) {
        const errorInput = d.createElement('p');
        errorInput.innerHTML = errorText || 'Invalid address.';
        errorInput.classList.add('error-input');
        errorInput.id = 'error-input';
        return errorInput;
    }

    function getLoader() {
        const errorInput = d.createElement('div');
        errorInput.innerHTML = '<div></div><div></div><div></div><div></div>';
        errorInput.classList.add('lds-ellipsis');
        return errorInput;
    }

    function getSuccessMessage(address, tx) {
        const wrapper = d.getElementsByClassName('faucet-content')[0];
        wrapper.classList.add('success-tx');
        wrapper.innerHTML = '';
        const successMessage = d.createElement('p');
        successMessage.innerHTML = `We sent <span>1 WASA</span> to the address:`;
        successMessage.classList.add('success-message')
        const addressLink = d.createElement('a');
        addressLink.innerHTML = '0x' + address;
        addressLink.href = `${provider}:9999/address/` + '0x' + address;
        addressLink.target = "_blank";
        addressLink.classList.add('address-link')
        const txWrapper = d.createElement('div');
        txWrapper.innerHTML=`<p>tx:</p><a target="_blank" href="${provider}:9999/transaction/${tx.transactionDataHash}" title="0x${tx.transactionDataHash}">0x${tx.transactionDataHash}</a>`
        txWrapper.classList.add('tx-wrapper', 'flex');
        const goBackButtonWrapper = d.createElement('div');
        goBackButtonWrapper.classList.add('faucet-submit-wrapper');
        const goBackButton = d.createElement('a');
        goBackButton.href = '/';
        goBackButton.innerHTML = 'Back';
        goBackButton.classList.add('faucet-submit');
        goBackButtonWrapper.appendChild(goBackButton);
        wrapper.appendChild(successMessage);
        wrapper.appendChild(addressLink);
        wrapper.appendChild(txWrapper);
        wrapper.appendChild(goBackButtonWrapper);
    }
})(document)