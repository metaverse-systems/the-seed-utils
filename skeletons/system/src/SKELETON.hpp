#pragma once

#include <libecs-cpp/ecs.hpp>

class SKELETON : public ecs::System
{
  public:
    SKELETON(); 
    SKELETON(Json::Value);
    Json::Value Export();
    void Update();
    void Init();
};
