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
        //
        Schema::table('usuarios', function (Blueprint $table) {
            $table->boolean('has_jugado_20_partidas')->default(false);
            $table->boolean('has_ganado_3_partidas_seguidas')->default(false);
            $table->boolean('has_ganado_15_partidas')->default(false);
            $table->boolean('se_llama_pol')->default(false);
            $table->boolean('se_llama_ermengol')->default(false);
            $table->boolean('se_llama_alvaro')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
