const pool = require('../utils/pool');
const Role = require('./Role.js');
const jwt = require('jsonwebtoken');

module.exports = class User {
    id;
    email;
    passwordHash;
    role;
    
    
    constructor(row) {
        this.id = row.id;
        this.email = row.email;
        this.passwordHash = row.password_hash;
        this.role = row.role;
    }                
    static async insert(email, passwordHash, roleTitle){
        const role = await Role.findByTitle(roleTitle);
        
        const { rows } = await pool.query(
            'INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *',
            [email, passwordHash, role.id]
            );
            return new User(rows[0]);
    }

    static async findByEmail(email) {
        const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (!rows[0]) return null;
        const oneRole = await Role.findById(rows[0].role_id);
        return new User({ ...rows[0], role: oneRole.title });
    }

    static async getMe(userId) {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        return new User(rows[0]);
    }

    authToken() {
        return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
          expiresIn: '24h',
        });
      }


    toJSON() {
        return {
            id: this.id,
            email: this.email,
            roleTitle: this.role
        };
    }
};
