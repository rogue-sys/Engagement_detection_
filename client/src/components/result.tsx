import React from 'react'
import { ResultType } from './type'

type Props = {
    result:ResultType
}
const Result = ({result}:Props) => {
  return (
    <div className="mt-4 text-center">
    <p>
      <strong>Class:</strong> {result.class}
    </p>
    <p>
      <strong>name:</strong> {result.name}
    </p>
  </div>
  )
}

export default Result
