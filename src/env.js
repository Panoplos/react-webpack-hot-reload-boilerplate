import dotenv from 'dotenv'

const denv = dotenv.config().parsed
function env(key, def) {
	return denv[key] !== undefined ? denv[key] : def || ''
}

export default env
