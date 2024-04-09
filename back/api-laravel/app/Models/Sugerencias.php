<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sugerencias extends Model
{
    use HasFactory;

    protected $table = 'sugerencia_usuario';

    protected $fillable = [
        'id',
        'sugerencia',
        'usuario_email'
    ];
}
