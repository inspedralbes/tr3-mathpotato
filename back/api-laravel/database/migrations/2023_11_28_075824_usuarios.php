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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('username', 50);
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->integer('num_victorias')->default(0);
            $table->integer('num_derrotas')->default(0);
            $table->enum('foto_perfil', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'alvaro', 'Ermengol', 'Poltata']);
            $table->integer('victorias_seguidas')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('usuarios');
    }
};
