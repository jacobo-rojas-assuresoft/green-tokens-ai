export function calculateImpact(tokens) {
  const electricity = (tokens * 0.5) / 1000;

  const water = (electricity * 0.5) / 1000;

  const co2 = (electricity * 0.4) / 1000;

  const cost = (tokens * 7) / 1000000;

  return {
    electricity,
    water,
    co2,
    cost,
  };
}