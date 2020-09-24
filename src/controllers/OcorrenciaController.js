const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;
    const [count] = await connection('ocorrencias').count();
    
    const ocorrencias = await connection('ocorrencias')
      .join('ongs', 'ongs.id', '=', 'ocorrencias.ong_id' )
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'ocorrencias.*',
        'ongs.nome',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.cidade',
        'ongs.uf'
      ]);
      response.header('X-Total_Count', count['count(*)']);
    return response.json(ocorrencias);
  },

  async create(request, response) {
    const { titulo, descricao, valor } = request.body;
    const ong_id = request.headers.authorization;

    const [id] =  await connection('ocorrencias').insert({
      titulo, 
      descricao, 
      valor,
      ong_id
    });
    return response.json({ id })
  }, 
  

  async delete(request, response) {
    const { id } = request.params;
    const ong_id = request.headers.authorization;
    const ocorrencias = await connection('ocorrencias')
      .where('id', id)
      .select('ong_id')
      .first();

      if (ocorrencias.ong_id !== ong_id) {
        return response.status(401).json({
          error: 'Operação não permitida' });
      }

      await connection('ocorrencias').where('id', id).delete();
      return response.status(204).send();
  }
};