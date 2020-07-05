#include "SKELETON.hpp"

int main(int argc, char *argv[])
{
    auto world = ECS->Container();

    world->Start(1000000 / 30);

    while(ECS->IsRunning())
    {
        usleep(100000);
    }
    return 0;
}
