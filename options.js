const userData = {
  OPTIONS: {
    HISTORY_LENGTH: 20,
    POPUP_HISTORY_LENGTH: 5,
  },
  HISTORY: [],
  SERIES: {},
};

const retrieveInfo = () =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.get('data', (items) => {
      if (chrome.runtime.error) {
        reject(chrome.runtime.error);
        return;
      }
      resolve(items.data);
    });
  });

const renderInputs = (data) => {
  // fill options inputs
  document.querySelectorAll('input').forEach((element) => {
    const optionName = element.getAttribute('name');
    element.value = data.OPTIONS[optionName];
  });
  // fill data import/export textarea
  document.getElementById('data-export').value = JSON.stringify(data);
};

const refreshOptions = () =>
  retrieveInfo()
    .then((data = {}) => {
      Object.assign(userData, data);
      renderInputs(userData);
    })
    .catch((err) => {
      alert(`[ERROR] ${err}`);
    });

const activateExpandable = () => {
  document.querySelectorAll('.expand').forEach((element) => {
    element.onclick = (e) => {
      e.preventDefault();
      document.querySelector('.expand.active').className = 'expand';
      element.className = 'expand active';
      const targetId = element.getAttribute('href').slice(1);
      document.querySelector('.block.active').className = 'block';
      document.getElementById(targetId).className = 'block active';
    };
  });
};

document.addEventListener('DOMContentLoaded', () => {
  activateExpandable();
  refreshOptions();

  document.querySelectorAll('input').forEach((element) => {
    element.onchange = () => {
      chrome.runtime.sendMessage({
        action: 'OPTIONS',
        data: {
          name: element.getAttribute('name'),
          value: element.value,
        },
      });
    };
  });

  const dataExportTextArea = document.getElementById('data-export');
  const dataImportResultText = document.getElementById('import-result');
  dataExportTextArea.onchange = () => {
    dataExportTextArea.className = '';
    dataImportResultText.className = '';
    try {
      const data = JSON.parse(dataExportTextArea.value);
      if (!data) {
        dataExportTextArea.className = 'invalid';
        dataImportResultText.className = 'invalid';
        dataImportResultText.innerHTML = 'Invalid application data';
        alert('[ERROR] Unvalid data.');
        return;
      }
      chrome.runtime.sendMessage({
        action: 'IMPORT',
        data,
      });
      dataExportTextArea.className = 'valid';
      dataImportResultText.className = 'valid';
      dataImportResultText.innerHTML = 'Data saved';
    } catch (e) {
      dataExportTextArea.className = 'invalid';
      dataImportResultText.className = 'invalid';
      dataImportResultText.innerHTML = 'Invalid JSON format data';
    }
  };

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'REFRESH') {
      refreshOptions();
    }
  });
});
