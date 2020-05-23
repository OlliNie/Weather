export const getSenesorVoltage = () => {
  //  Without having GPIO and sensor setup, mock data with math.random.
  const sensorVoltage = Math.random() * 10;
  return sensorVoltage;
};
