import './SevenSegmentDigit.css'

interface SevenSegmentDigitProps {
  digit: number
  className?: string
}

const SevenSegmentDigit: React.FC<SevenSegmentDigitProps> = ({ digit, className }) => {
  const segments = [
    digit === 0 || digit === 2 || digit === 3 || digit === 5 || digit === 6 || digit === 7 || digit === 8 || digit === 9, // a
    digit === 0 || digit === 1 || digit === 2 || digit === 3 || digit === 4 || digit === 7 || digit === 8 || digit === 9, // b
    digit === 0 || digit === 1 || digit === 3 || digit === 4 || digit === 5 || digit === 6 || digit === 7 || digit === 8 || digit === 9, // c
    digit === 0 || digit === 2 || digit === 3 || digit === 5 || digit === 6 || digit === 8 || digit === 9, // d
    digit === 0 || digit === 2 || digit === 6 || digit === 8, // e
    digit === 0 || digit === 4 || digit === 5 || digit === 6 || digit === 8 || digit === 9, // f
    digit === 2 || digit === 3 || digit === 4 || digit === 5 || digit === 6 || digit === 8 || digit === 9, // g
  ]

  return (
    <div className={`seven-segment-digit ${className || ''}`}>
      <div className={`segment a ${segments[0] ? 'on' : 'off'}`}></div>
      <div className={`segment b ${segments[1] ? 'on' : 'off'}`}></div>
      <div className={`segment c ${segments[2] ? 'on' : 'off'}`}></div>
      <div className={`segment d ${segments[3] ? 'on' : 'off'}`}></div>
      <div className={`segment e ${segments[4] ? 'on' : 'off'}`}></div>
      <div className={`segment f ${segments[5] ? 'on' : 'off'}`}></div>
      <div className={`segment g ${segments[6] ? 'on' : 'off'}`}></div>
    </div>
  )
}

export default SevenSegmentDigit