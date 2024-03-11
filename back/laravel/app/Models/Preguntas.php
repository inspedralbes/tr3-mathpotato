<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Preguntas extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'id_pregunta';
    
    protected $fillable = [
        'pregunta',
        'user'
    ];
    
    public $timestamps = false;
}
