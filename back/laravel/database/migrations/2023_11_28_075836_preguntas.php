<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('preguntas', function (Blueprint $table) {
            $table->id('id_pregunta');
            $table->string('pregunta', 100);
            $table->string('usuario', 255)->foreign('usuario')->references('email')->on('usuarios');
            $table->boolean('activo')->default(true);
            }    
        ); 
    }
};
