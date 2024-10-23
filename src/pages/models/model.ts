import { useState } from 'react'

const EnvModel = () => {
  const [envs, setEnvs] = useState('')
  return {
    envs,
    setEnvs
  }
}
export default EnvModel
