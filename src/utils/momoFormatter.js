export const parseGhanaMoMoDetails = (phoneClean) => {
  if (phoneClean.length !== 10) return { isValid: false };
  
  const prefix = phoneClean.substring(0, 3);
  let network = 'UNKNOWN';

  // MTN prefixes
  if (['024', '054', '055', '059', '025', '053'].includes(prefix)) {
    network = 'MTN';
  } 
  // Vodafone / Telecel prefixes
  else if (['020', '050'].includes(prefix)) {
    network = 'VOD';
  }
  // AirtelTigo prefixes
  else if (['027', '057', '026', '056'].includes(prefix)) {
    network = 'ATL';
  }

  if (network === 'UNKNOWN') return { isValid: false };

  return { isValid: true, number: phoneClean, network };
};
