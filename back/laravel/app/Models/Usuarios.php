<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuarios extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'usuarios';

    protected $primaryKey = 'id'; // Agrega esta línea para configurar la clave primaria.

    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'foto_perfil'
    ];

    public $timestamps = false;
}
